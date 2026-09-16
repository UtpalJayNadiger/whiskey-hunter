import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchBody, normalizeResults } from '../.test-build/search-data.js';
test('bounds search and rejects malformed dates before spending',()=>{
 assert.equal(searchBody({topic:'distillery news'}).numResults,5);
 assert.equal(searchBody({topic:'distillery news',since:'2026-01-01'}).startPublishedDate,'2026-01-01T00:00:00.000Z');
 for(const since of ['2026-02-30','tomorrow','2026-13-01'])assert.throws(()=>searchBody({topic:'news',since}));
 assert.throws(()=>searchBody({topic:'x'.repeat(301)}));
});
test('drops unsafe URLs and duplicates, limits retrieved text',()=>{
 const result=normalizeResults({results:[{url:'javascript:alert(1)'},{url:'https://example.com/release#one',text:'x'.repeat(9000)},{url:'https://example.com/release#two'},{url:'https://user:password@example.com'}]});
 assert.equal(result.results.length,1);assert.equal(result.results[0].text.length,4000);
 assert.equal(result.results[0].publishedDate,null);
});
test('invalid upstream output is not silently treated as no releases',()=>{
 assert.throws(()=>normalizeResults({error:'bad key'}));
 assert.deepEqual(normalizeResults({results:[]}).results,[]);
});
