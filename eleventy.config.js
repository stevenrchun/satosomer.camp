export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("assets");
  //eleventyConfig.addWatchTarget("style.css");
}
