const cheerio = require('cheerio');
const fs = require('fs');
const TurndownService = require('turndown');

async function getContentOfWebsite(wordCountThreshold) {
    try {
        // Read test_source.html from current directory
        const html = fs.readFileSync('test_source.html', 'utf8');

        // Load HTML content into Cheerio
        const $ = cheerio.load(html, {
            ignoreWhitespace: true,
            xmlMode: true
        });

        // Get the content within the <body> tag
        const $body = $('body');

        // Remove script, style, and other tags that don't carry useful content from body
        $body.find('script, style, link[rel="stylesheet"], meta, noscript').remove();

        // Remove all attributes from remaining tags in body, except for img tags
        $body.find('*:not(img)').each((_, el) => {
            const $el = $(el);
            $el.removeAttr('class').removeAttr('id').removeAttr('style').removeAttr('onclick').removeAttr('onmouseover').removeAttr('onmouseout');
        });

        // Replace images with their alt text or remove them if no alt text is available
        $body.find('img').each((_, img) => {
            const $img = $(img);
            const altText = $img.attr('alt');
            if (altText) {
                $img.replaceWith($('<span>').text(altText));
            } else {
                $img.remove();
            }
        });

        // Recursively remove empty elements, their parent elements, and elements with word count below threshold
        function removeEmptyAndLowWordCountElements($node) {
            $node.contents().each((_, el) => {
                const $el = $(el);
                if ($el.is('*')) {
                    removeEmptyAndLowWordCountElements($el);
                    const wordCount = $el.text().trim().split(/\s+/).length;
                    if (($el.contents().length === 0 && $el.text().trim() === '') || wordCount < wordCountThreshold) {
                        $el.remove();
                    }
                }
            });
        }

        removeEmptyAndLowWordCountElements($body);

        // Flatten nested elements with only one child of the same type
        function flattenNestedElements($node) {
            $node.contents().each((_, el) => {
                const $el = $(el);
                if ($el.is('*')) {
                    flattenNestedElements($el);
                    const $children = $el.children();
                    // console.log($children.length===1, $children.first().is($el.prop('tagName')), $el.prop('tagName') == $children.first().prop('tagName'))
                    // if ($children.length === 1 && $children.first().is($el.prop('tagName'))) {
                    if ($children.length === 1 && $el.prop('tagName') == $children.first().prop('tagName')) {
                        console.log('Flattening:', $el.prop('tagName'));
                        const $child = $children.first();
                        $el.replaceWith($child);
                    }
                    
                }
            });
        }

        flattenNestedElements($body);

        // Remove comments
        $.root().find('*').contents().filter((_, node) => node.type === 'comment').remove();

        // Remove consecutive empty newlines and replace multiple spaces with a single space
        const cleanedHTML = $body.html().replace(/(\r\n|\r|\n){2,}/g, '\n').replace(/\s+/g, ' ');

        // Save the cleaned HTML content to test.html
        fs.writeFileSync('test.html', cleanedHTML);

        // Convert cleaned HTML to Markdown
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(cleanedHTML);

        // Save the Markdown content to test.md
        fs.writeFileSync('test.md', markdown);

        // Return the cleaned HTML content
        return cleanedHTML;

    } catch (error) {
        console.error('Error processing HTML content:', error);
        return null;
    }
}

// Example usage
const wordCountThreshold = 5; // Adjust this value according to your desired threshold
getContentOfWebsite(wordCountThreshold)
    .then(cleanedContent => {
        // console.log(cleanedContent);
    })
    .catch(error => {
        console.error('Error:', error);
    });