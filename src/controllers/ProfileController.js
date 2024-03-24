const Profile = require('../model/Profile')

module.exports = {
  async index(req, res) {
    return res.render('profile', { profile: await Profile.get() })
  },

  async update(req, res) {
    // req.body to get the data
    const data = req.body

    // define how many weeks are in a year: 52
    const weeksPerYear = 52

    // remove the vacation weeks from the year, to get how many weeks there are in 1 month
    const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12

    // total hours worked in the week
    const weekTotalHours = data['hours-per-day'] * data['days-per-week']

    // hours worked in the month
    const monthlyTotalHours = weekTotalHours * weeksPerMonth

    // What will my hourly rate be?
    const valueHour = data['monthly-budget'] / monthlyTotalHours

    const profile = await Profile.get()

    await Profile.update({
      ...profile,
      ...req.body,
      'value-hour': valueHour
    })

    return res.redirect('/profile')
  }
}
