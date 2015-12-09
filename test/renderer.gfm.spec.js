'use strict';

var gfmRenderer = require('../src/renderer.gfm'),
    toDom = require('../src/toDom'),
    DomRunner = require('../src/domRunner');

describe('gfmRenderer', function() {
    //test case use only
    function getMarkdownText(htmlStr, subContent, nextCount) {
        var runner = new DomRunner(toDom(htmlStr));

        nextCount = nextCount || 1;

        while (nextCount) {
            runner.next();
            nextCount -= 1;
        }

        return gfmRenderer.convert(runner.getNode(), subContent);
    }

    describe('del, s', function() {
        it('~~subcontent~~', function() {
            expect(getMarkdownText('<p><del>text</del></p>', 'text', 2)).toEqual('~~text~~');
            expect(getMarkdownText('<p><s>text</s></p>', 'text', 2)).toEqual('~~text~~');
        });
    });

    describe('pre code', function() {
        it('code with ```', function() {
            expect(getMarkdownText('<pre><code></code></pre>', 'function(){\n    var in=0;\n}', 2))
                .toEqual('\n\n```\nfunction(){\n    var in=0;\n}\n```\n\n');
        });

        it('code with specific language', function() {
            expect(getMarkdownText('<pre><code data-language="javascript"></code></pre>', 'function(){\n    var in=0;\n}', 2))
                .toEqual('\n\n``` javascript\nfunction(){\n    var in=0;\n}\n```\n\n');
        });
    });

    describe('li input', function() {
        it('unchecked input box', function() {
            expect(getMarkdownText('<li><input type="checkbox" /></li>', null, 2)).toEqual('[ ] ');
        });

        it('checked input box', function() {
            expect(getMarkdownText('<li><input type="checkbox" checked="checked" /></li>', null, 2)).toEqual('[x] ');
        });
    });

    describe('table', function() {
        describe('TABLE', function() {
            it('wrap subContent with \\n\\n', function() {
                expect(getMarkdownText('<table></table>', '\n| text |\n| ---- |\n')).toEqual('\n\n\n| text |\n| ---- |\n\n\n');
            });
        });

        describe('TR TD, TR TH', function() {
            it('should return subContent and |', function() {
                expect(getMarkdownText('<table><tr><td>text</td></tr></table>', 'text', 4)).toEqual(' text |');
                expect(getMarkdownText('<table><tr><th>text</th></tr></table>', 'text', 4)).toEqual(' text |');
            });
        });

        describe('TD BR, TH BR', function() {
            it('br should return inline tag in table', function() {
                expect(getMarkdownText('<table><tr><td>text<br>text</td></tr></table>', 'text', 6)).toEqual('<br>');
                expect(getMarkdownText('<table><tr><th>text<br>text</th></tr></table>', 'text', 6)).toEqual('<br>');
            });
        });

        describe('TR', function() {
            it('should return | and subContent', function() {
                expect(getMarkdownText('<table><tr><td>text</td></tr></table>', ' text |', 3)).toEqual('| text |\n');
            });

            it('should return nothing when subContents have nothing', function() {
                expect(getMarkdownText('<table><tr><td></td></tr></table>', '', 3)).toEqual('');
            });
        });

        describe('THEAD', function() {
            it('table with head', function() {
                expect(getMarkdownText('<table><thead><tr><th>text</th></tr></thead></table>', '\n| text |\n', 2)).toEqual('\n| text |\n| ---- |\n');
            });

            it('should return nothing when subContents have nothing', function() {
                expect(getMarkdownText('<table><thead><tr><th>text</th></tr></thead></table>', '', 2)).toEqual('');
            });

            it('table with left align head', function() {
                expect(getMarkdownText('<table><thead><tr><th align="left">text</th></tr></thead></table>', '\n| text |\n', 2)).toEqual('\n| text |\n| :--- |\n');
            });

            it('table with right align head', function() {
                expect(getMarkdownText('<table><thead><tr><th align="right">text</th></tr></thead></table>', '\n| text |\n', 2)).toEqual('\n| text |\n| ---: |\n');
            });

            it('table with center align head', function() {
                expect(getMarkdownText('<table><thead><tr><th align="center">text</th></tr></thead></table>', '\n| text |\n', 2)).toEqual('\n| text |\n| :--: |\n');
            });
        });
    });
});