class Netease {
  constructor() {
    this.baseUrl = `http://localhost:${port}`
    fetch(`${this.baseUrl}/api/playlist/detail?id=2873222985`).then(res => res.json()).then(res => {
      console.log(res)
    })
  }

}
new Netease()