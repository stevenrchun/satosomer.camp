export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("itinerary.css");
  eleventyConfig.addPassthroughCopy("travel.css");
  eleventyConfig.addPassthroughCopy("lodging.css");
  eleventyConfig.addPassthroughCopy("packing.css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
  });
}
