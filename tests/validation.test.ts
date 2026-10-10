import test from "node:test";
import assert from "node:assert/strict";
import { applicationCreate, companyPatch, jobPatch, profilePatch, resumeCreate } from "../lib/validation";

test("job updates cannot change owner, publication, or nested relations", () => {
  for (const input of [{userId:"another-user"},{isPublished:true},{savedUsers:["attacker"]},{company:{connect:{id:"a".repeat(24)}}}]) {
    assert.equal(jobPatch.safeParse(input).success, false);
  }
  assert.equal(jobPatch.safeParse({title:"Backend engineer", tags:["Python"]}).success,true);
});
test("company and profile updates reject ownership changes", () => {
  assert.equal(companyPatch.safeParse({userId:"other",name:"Company"}).success,false);
  assert.equal(profilePatch.safeParse({userId:"other",email:"me@example.com"}).success,false);
});
test("resume URLs reject executable and unencrypted schemes", () => {
  for (const url of ["javascript:alert(1)","http://example.com/resume.pdf"]) assert.equal(resumeCreate.safeParse({name:"CV",url,userProfileId:"user_me"}).success,false);
  assert.equal(resumeCreate.safeParse({name:"CV",url:"https://example.com/resume.pdf",userProfileId:"user_me"}).success,true);
});
test("applications require valid IDs and email", () => {
  assert.equal(applicationCreate.safeParse({jobId:"a".repeat(24),resumeId:"b".repeat(24),contactEmail:"me@example.com"}).success,true);
  assert.equal(applicationCreate.safeParse({jobId:"bad",resumeId:"b".repeat(24),contactEmail:"invalid"}).success,false);
});
