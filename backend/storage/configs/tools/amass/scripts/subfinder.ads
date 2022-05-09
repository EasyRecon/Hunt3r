name = "subfinder"
type = "ext"

function start()
  set_rate_limit(1)
end

function vertical(ctx, domain)
  print("-- Subfinder")
  local cmd = "subfinder -silent -d " .. domain

  local data = assert(io.popen(cmd))
  for line in data:lines() do
    print(line)
    newname(ctx, line)
  end
  data:close()
end