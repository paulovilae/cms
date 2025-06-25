// Simple script to seed the database
fetch('http://localhost:3002/next/seed', {
  method: 'POST',
})
  .then((res) => {
    console.log('Response status:', res.status)
    return res.text()
  })
  .then((text) => {
    console.log('Seed process completed:')
    console.log(text)
  })
  .catch((err) => {
    console.error('Error seeding database:', err)
  })
