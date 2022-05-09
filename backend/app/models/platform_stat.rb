class PlatformStat < ApplicationRecord
  belongs_to :platform

  scope :filtered, ->(query_params) { where("DATE(report_date) BETWEEN ? AND ?", query_params[:from], query_params[:to]) }

  def normalize_severity
    case severity
    when 'C'
      'Critical'
    when 'H'
      'High'
    when 'M'
      'Medium'
    when 'L'
      'Low'
    when '7'
      'Undecided'
    when '6'
      'Exceptional'
    when '5'
      'Critical'
    when '4'
      'High'
    when '3'
      'Medium'
    when '2'
      'Low'
    else
      severity
    end
  end

  def normalize_report_status
    case report_status
    when 'wont_fix'
      "Won't fix"
    when 'ask_verif'
      'Ask Verification'
    when 'resolved'
      'Resolved'
    when 'duplicate'
      'Duplicate'
    when 'accepted'
      'Accepted'
    when 'informative'
      'Informative'
    when 'not_applicable'
      'Not Applicable'
    when 'invalid'
      'Invalid'
    when 'auto_close'
      'Auto Close'
    when 'accepted risk'
      'Accepted Risk'
    when 'out of scope'
      'Out Of Scope'
    when 'spam'
      'SPAM'
    when 'triaged'
      'Triaged'
    when 'draft'
      'Draft'
    else
      report_status
    end
  end
end
