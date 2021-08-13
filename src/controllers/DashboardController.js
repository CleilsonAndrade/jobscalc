const Job = require('../model/Job')
const Profile = require('../model/Profile')
const JobUtils = require('../utils/JobUtils')

module.exports = {
  async index(req, res) {
    const jobs = await Job.get()
    const profile = await Profile.get()

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length
    }

    let jobTotalHours = 0

    const updatedJobs = jobs.map(job => {
      const remaining = JobUtils.remainingDays(job)
      const status = remaining <= 0 ? 'done' : 'progress'

      statusCount[status] += 1

      jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile['value-hour'])
      }
    })

    const freeHours = profile['hours-per-day'] - jobTotalHours

    return res.render('index', {
      jobs: updatedJobs,
      profile: profile,
      statusCount: statusCount,
      freeHours: freeHours
    })
  }
}
