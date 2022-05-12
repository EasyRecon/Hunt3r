class Scope < ApplicationRecord
  scope :filtered, ->(query_params) { where('scope LIKE ?', "%#{query_params}%") }

  def nb_leaks
    0
  end

  def normalize(platform)
    case platform.name
    when 'yeswehack'
      normalize_ywh_scope
    when 'intigriti'
      normalize_intigriti_scope
    when 'hackerone'
      normalize_hackerone_scope
    else
      nil
    end
  end

  def normalize_ywh_scope_type
    return if scope.match?(/\(?\+\)?/)

    self.scope_type = case scope_type
                      when 'web-application'
                        'Web Application'
                      when 'api'
                        'API'
                      else
                        scope_type
                      end

    save
  end

  def normalize_ywh_scope
    scope.gsub!(/\(?\+\)?/, '')
    scope.strip!

    match = scope.match(/^(.*)\((.*)\)$/)
    if match && match[1] && match[2]
      ywh_scope_split(match[1], match[2])
    else
      normalize_ywh_scope_type
    end
  end

  def ywh_scope_split(domains, tlds)
    tlds = tlds.split('|')
    tlds.each do |tld|
      new_scope = dup
      new_scope.scope = "#{domains}#{tld}"
      new_scope.normalize_ywh_scope_type
    end
  end

  def normalize_intigriti_scope
    self.scope_type = case scope_type
                      when 1
                        'Web Application'
                      else
                        scope_type
                      end

    save
  end

  def normalize_hackerone_scope
    self.scope_type = case scope_type
                      when 'URL'
                        'Web Application'
                      else
                        scope_type
                      end

    save
  end
end
