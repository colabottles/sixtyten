const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

// Import filters

module.exports = function (config) {
  config.addPlugin(pluginRss);
  config.addPlugin(syntaxHighlight);
  config.setDataDeepMerge(true);

  config.addLayoutAlias("post", "layouts/post.njk");

  config.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLLL, yyyy"
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  config.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLLL, yyyy"
    );
  });

  // Get the first `n` elements of a collection.
  config.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  config.addCollection("tagList", require("./_11ty/getTagList"));

  config.addPassthroughCopy("img");
  config.addPassthroughCopy("css");
  config.addPassthroughCopy("js");
  config.addPassthroughCopy("fonts");

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };
  let opts = {
    permalink: false,
    permalinkClass: "direct-link",
    permalinkSymbol: "#",
  };

  config.setLibrary(
    "md",
    markdownIt(options).use(markdownItAnchor, opts)
  );

  // config.setBrowserSyncConfig({
  //   callbacks: {
  //     ready: function (err, browserSync) {
  //       const content_404 = fs.readFileSync("_site/404.html");

  //       browserSync.addMiddleware("*", (req, res) => {
  //         // Provides the 404 content without redirect.
  //         res.write(content_404);
  //         res.end();
  //       });
  //     },
  //   },
  // });

  return {
    templateFormats: ["md", "njk", "html", "liquid", "js"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
