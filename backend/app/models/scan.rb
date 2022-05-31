class Scan < ApplicationRecord
  has_one :server

  validates :domain, presence: true

  def cost
    last_update = if state == 'Finished' || state == 'Stopped'
                    updated_at.to_i
                  else
                    Time.now.to_i
                  end

    running_time = last_update - created_at.to_i

    return 0 if running_time < 3600

    case instance_type
    when 'DEV1-S'
      "#{((running_time / 3600) * 0.0108).round(2)}€"
    when 'DEV1-M'
      "#{((running_time / 3600) * 0.0216).round(2)}€"
    when 'DEV1-L'
      "#{((running_time / 3600) * 0.0432).round(2)}€"
    when 'DEV1-XL'
      "#{((running_time / 3600) * 0.0648).round(2)}€"
    else
      0
    end
  end

  def concurrency
    multiplicator = {
      'DEV1-S' => 1,
      'DEV1-M' => 2,
      'DEV1-L' => 3,
      'DEV1-XL' => 4
    }
    multiplicator[instance_type]
  end

  def instance_type_valid?
    %w[DEV1-S DEV1-M DEV1-M DEV1-XL].include?(instance_type)
  end
end
