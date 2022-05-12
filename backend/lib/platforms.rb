require_relative 'platforms/hackerone'
require_relative 'platforms/intigriti'
require_relative 'platforms/yeswehack'

module Platforms
  def platform_is_valid?(platform)
    hunter_username = get_hunter_username(platform)
    return false if hunter_username.nil?

    platform.update(hunter_username: hunter_username)
  end

  def get_platform_jwt(platform)
    case platform.name
    when 'yeswehack'
      YesWeHack.get_jwt(platform)
    when 'intigriti'
      Intigriti.get_jwt(platform)
    when 'hackerone'
      Hackerone.get_jwt(platform)
    else
      nil
    end
  end

  def get_hunter_username(platform)
    case platform.name
    when 'yeswehack'
      YesWeHack.get_username(platform)
    when 'intigriti'
      Intigriti.get_username(platform)
    when 'hackerone'
      Hackerone.get_username(platform)
    else
      nil
    end
  end

  def update_programs(platform)
    case platform.name
    when 'yeswehack'
      Thread.start do
        YesWeHack.update_programs(platform)
      end
    when 'intigriti'
      Thread.start do
        Intigriti.update_programs(platform)
      end
    when 'hackerone'
      Thread.start do
        Hackerone.update_programs(platform)
      end
    else
      nil
    end
  end

  def update_scopes(platform, slug)
    get_platform_jwt(platform)

    case platform.name
    when 'yeswehack'
      YesWeHack.update_scopes(platform, slug)
    else
      nil
    end
  end

  def update_reports(platform)
    get_platform_jwt(platform)

    case platform.name
    when 'yeswehack'
      YesWeHack.get_reports(platform, false)
      YesWeHack.get_reports(platform, true)
    when 'intigriti'
      Intigriti.get_reports(platform)
    when 'hackerone'
      Hackerone.get_reports(platform)
    else
      nil
    end
  end

  def get_payouts(platform, from, to)
    get_platform_jwt(platform)

    case platform.name
    when 'intigriti'
      Intigriti.payouts(platform, from, to)
    else
      nil
    end
  end
end
