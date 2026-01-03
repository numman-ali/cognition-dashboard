<script lang="ts">
  import '../app.css';
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <h1 class="text-4xl font-bold mb-2">Cognition Dashboard</h1>
      <p class="text-gray-400">Real-time Gas Town Visualization Engine</p>
    </header>

    <section class="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 class="text-2xl font-bold mb-4">Welcome</h2>
      <p class="text-gray-300 mb-4">
        This is the Gas Town visualization dashboard. It provides real-time monitoring
        of your distributed task orchestration system.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div class="bg-gray-700 p-4 rounded">
          <h3 class="text-lg font-semibold mb-2">Town Overview</h3>
          <p class="text-gray-400 text-sm">Interactive network diagram of your workspace</p>
        </div>
        <div class="bg-gray-700 p-4 rounded">
          <h3 class="text-lg font-semibold mb-2">Worker Status</h3>
          <p class="text-gray-400 text-sm">Real-time monitoring of polecats and crew</p>
        </div>
        <div class="bg-gray-700 p-4 rounded">
          <h3 class="text-lg font-semibold mb-2">Merge Pipeline</h3>
          <p class="text-gray-400 text-sm">Visualize work flowing through the Refinery</p>
        </div>
        <div class="bg-gray-700 p-4 rounded">
          <h3 class="text-lg font-semibold mb-2">Convoy Dashboard</h3>
          <p class="text-gray-400 text-sm">Track batched work items and progress</p>
        </div>
      </div>

      <p class="text-gray-500 text-sm mt-6">
        More features coming soon. Building in real-time with Gas Town!
      </p>
    </section>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
