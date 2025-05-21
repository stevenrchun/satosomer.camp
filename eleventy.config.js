export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("assets/grassy.json");
  eleventyConfig.addPassthroughCopy("CNAME");
  //eleventyConfig.addWatchTarget("style.css");
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
  });
}
