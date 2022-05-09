name = "findomain"
type = "ext"

function start()
  set_rate_limit(1)
end

function vertical(ctx, domain)
  print("-- Findomain")
  local cmd = "findomain -q --target " .. domain

  local data = assert(io.popen(cmd))
  for line in data:lines() do
    print(line)
    newname(ctx, line)
  end
  data:close()
end