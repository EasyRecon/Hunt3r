class PlatformStat < ApplicationRecord
  belongs_to :platform

  scope :filtered, ->(query_params) { where('DATE(report_date) BETWEEN ? AND ?', query_params[:from], query_params[:to]) }

  def normalize_severity
    # TODO
    severity
  end

  def normalize_report_status
    # TODO
    report_status
  end
end
