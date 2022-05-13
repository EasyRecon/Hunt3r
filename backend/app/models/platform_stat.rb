class PlatformStat < ApplicationRecord
  belongs_to :platform

  scope :filtered, ->(query_params) { where('DATE(report_date) BETWEEN ? AND ?', query_params[:from], query_params[:to]) }

  def normalize_severity
    case self.platform.name
    when 'yeswehack'
      normalize_ywh_severity(severity)
    when 'intigriti'
      normalize_inti_severity(severity)
    else
      severity
    end
  end

  def normalize_report_status
    case self.platform.name
    when 'yeswehack'
      normalize_ywh_status(report_status)
    when 'intigriti'
      normalize_inti_status(report_status)
    else
      report_status
    end
  end

  private

  def normalize_ywh_severity(severity)
    severities = {
      'C' => 'Critical',
      'H' => 'High',
      'M' => 'Medium',
      'L' => 'Low'
    }
    severities[severity]
  end

  def normalize_ywh_status(status)
    ywh_status = {
      'ask_verif' => 'Ask For Verification',
      'duplicate' => 'Duplicate',
      'wont_fix' => "Won't fix",
      'resolved' => 'Resolved',
      'informative' => 'Informative',
      'accepted' => 'Accepted',
      'not_applicable' => 'Not Applicable',
      'invalid' => 'Invalid',
      'auto_close' => 'Self Closed'
    }
    ywh_status[status]
  end

  def normalize_inti_severity(severity)
    severities = {
      '7' => 'Undecided',
      '6' => 'Exceptional',
      '5' => 'Critical',
      '4' => 'High',
      '3' => 'Medium',
      '2' => 'Low'
    }
    severities[severity]
  end

  def normalize_inti_status(status)
    status = status.split(',')

    case status[0]
    when '4', '5'
      inti_status = {
        '7' => 'NA',
        '6' => 'SPAM',
        '5' => 'Out Of Scope',
        '4' => 'Informative',
        '3' => 'Accepted Risk',
        '2' => 'Duplicate',
        '1' => 'Resolved'
      }
      inti_status[status[1]]
    when '3'
      'Accepted'
    when '2'
      'Triaged'
    when '1'
      'Draft'
    end
  end
end
