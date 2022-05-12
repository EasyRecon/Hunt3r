class Scan < ApplicationRecord
  has_one :server

  def cost
    running_time = updated_at.to_i - created_at.to_i

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
end
