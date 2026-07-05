import fs from 'fs';
let content = fs.readFileSync('src/pages/index.astro', 'utf8');

const oldLayout = `  <div class="max-w-[1200px] mx-auto px-6 md:px-10 py-12 flex flex-col lg:flex-row gap-12">
    <div class="lg:w-1/3 flex flex-col justify-center">
      <Hero client:load />
    </div>
        
    {featuredPosts.length > 0 && (
      <div class="lg:w-2/3 h-[380px]">
        <PostCarousel posts={featuredPosts} client:load />
      </div>
    )}
  </div>`;

const newLayout = `  <div class="max-w-[1200px] mx-auto px-6 md:px-10 py-16 flex flex-col gap-16">
    <div class="w-full flex flex-col justify-center items-center">
      <Hero client:load />
    </div>
        
    {featuredPosts.length > 0 && (
      <div class="w-full h-[450px]">
        <PostCarousel posts={featuredPosts} client:load />
      </div>
    )}
  </div>`;

content = content.replace(oldLayout, newLayout);
fs.writeFileSync('src/pages/index.astro', content);
