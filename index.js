import { getOctokit, context as _context } from '@actions/github';
import { getInput, setOutput, setFailed } from '@actions/core';

async function run() {
  try {
    const token = getInput('token');
    const octokit = getOctokit(token);
    const context = _context;

    const issuesAndPulls = await octokit.paginate(octokit.rest.issues.listForRepo, {
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'all',
    });

    const issue_stats = { open: 0, closed: 0 }

    const pull_stats = { open: 0, closed: 0, merged: 0 }

    for(const item of issuesAndPulls){
      if('pull_request' in item) {
        if(item.state == 'open') pull_stats.open ++;
        else{
          if(item.merged_at == null) pull_stats.closed ++;
          else pull_stats.merged ++;
        }
      }
      else {
        if(item.state == 'open') issue_stats.open ++;
        else issue_stats.closed ++;
      }
    }

    setOutput('pulls', pull_stats);
    setOutput('issues', issue_stats);
  } catch (error) {
    setFailed(error.message);
  }
}

run();
