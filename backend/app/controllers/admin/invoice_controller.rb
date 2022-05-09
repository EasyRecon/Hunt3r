require 'get_platform_jwt'

class Admin::InvoiceController < ApplicationController
  include(GetPlatformJwt)
  before_action :authenticate_user, :admin?

  # GET /platforms/:name/invoice
  def index
    platform = Platform.find_by_name(params[:name])
    unless allowed_platform?(platform)
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.invoices.unsupported_platform') }
    end

    current_invoice_data = Invoice.find_by_platform_id(platform.id)
    @invoice = current_invoice_data.nil? ? Invoice.new : current_invoice_data

    render status: 200, template: 'admin/invoices/index'
  end

  # POST /platforms/:name/invoice
  def create
    platform = Platform.find_by_name(params[:name])
    unless allowed_platform?(platform)
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.invoices.unsupported_platform') }
    end

    invoice_informations = params.require(:invoice).permit(:user_name, :user_lastname, :user_address, :user_phone, :user_email, :user_siret,
                                              :user_bic, :user_bank, :user_iban, :user_vat, :user_vat_number, :client_project,
                                              :client_name, :client_btw, :client_address, :client_email)

    # Clean before injecting into PDF
    invoice_informations.each do |param, value|
      next if value.is_a?(TrueClass) || value.is_a?(FalseClass)

      invoice_informations[param] = CGI.escapeHTML(value)
    end

    invoice_informations[:platform_id] = platform.id

    current_invoice_informations = Invoice.find_by_platform_id(platform.id)
    if current_invoice_informations.nil?
      Invoice.create(invoice_informations)
    else
      current_invoice_informations.update(invoice_informations)
    end

    render status: 200, json: { message: I18n.t('success.controllers.admin.invoices.updated') }
  end

  # GET /platforms/:name/invoice/generate
  def generate
    platform = Platform.find_by_name(params[:name])
    unless allowed_platform?(platform)
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.invoices.unsupported_platform') }
    end

    @from = params[:from]
    @to = params[:to]
    @invoice_id = params[:invoice_id]

    unless @from && @to && @invoice_id
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.invoices.missing_params') }
    end

    @invoice_date = Time.now.strftime('%B %d, %Y')
    @invoice_data = Invoice.find_by_platform_id(platform.id)

    if @invoice_data.nil?
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.invoices.informations_missing') }
    end

    template = File.read(invoice_template_file)
    jwt = get_platform_jwt(platform)
    @payouts = get_intigriti_payouts(jwt, @from, @to)

    if @payouts.nil? || @payouts.empty?
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.invoices.no_payouts') }
    end

    result = ERB.new(template).result(binding)

    # write result to file
    File.open(invoice_html_file, 'w') do |f|
      f.write(result)
    end

    PDFKit.configure do |config|
      config.default_options = {
        'enable-local-file-access': true,
        margin_top: '0.1in',
        margin_left: '0.1in',
        margin_right: '0.1in',
        page_size: 'Letter'
      }
    end

    kit = PDFKit.new(File.new(invoice_html_file))
    kit.to_file(invoice_pdf_file)

    pdf_data = File.open(invoice_pdf_file).read
    encoded = Base64.encode64(pdf_data)

    render status: 200, json: { message: nil, data: encoded }
  end

  private

  def allowed_platform?(platform)
    !platform.nil? && platform.name == 'intigriti'
  end

  def invoice_template_file
    Rails.root.join('app', 'views', 'admin', 'invoices', 'template', 'template.html.erb')
  end

  def invoice_html_file
    Rails.root.join('app', 'views', 'admin', 'invoices', 'template', 'invoice.html')
  end

  def invoice_pdf_file
    Rails.root.join('/tmp/invoice.pdf')
  end

  def get_intigriti_payouts(jwt, from, to)
    from_timestamp = Date.parse(from).to_time.to_i # 00:00 AM
    to_timestamp = Date.parse(to).to_time.to_i + 86_399 # 23:59 PM

    request = Typhoeus::Request.new(
      'https://api.intigriti.com/core/researcher/payout',
      headers: { Authorization: "Bearer #{jwt}" }
    )

    request.run
    response = request.response

    return unless response&.code == 200

    payouts = JSON.parse(response.body)

    payouts_data = {}

    payouts.each do |payout|
      next unless payout['createdAt'] > from_timestamp && payout['createdAt'] < to_timestamp

      paid_date = DateTime.strptime(payout['createdAt'].to_s, '%s').strftime('%d-%m-%Y')

      if payouts_data.has_key?(payout['submissionCode'])
        payouts_data[payout['submissionCode']][:amount] += payout['amount']['value']
      else
        payouts_data[payout['submissionCode']] = { date: paid_date, title: payout['submissionTitle'], amount: payout['amount']['value'] }
      end
    end

    payouts_data
  end
end
