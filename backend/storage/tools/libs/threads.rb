class ThreadPool
  def initialize(size: 15 * OPTIONS[:concurrency])
    @size = size
    @tasks = Queue.new
    @pool = []
  end

  def schedule(*args, &block)
    @tasks << [block, args]
  end

  def start
    Thread.new do
      loop do
        next if @pool.size >= @size

        task, args = @tasks.pop
        thread = Thread.new do
          task.call(*args)
          end_thread(thread)
        end
        @pool << thread
      end
    end
  end

  def end_thread(thread)
    @pool.delete(thread)
    thread.kill
  end

  def inactive?
    @tasks.empty? && @pool.empty?
  end
end