
const revalidateStaticSite = ()=> {
    const BASE_URL = process.env.STATIC_SITE_PATH
    fetch(`${BASE_URL}/api/revalidate`, {
        method: "GET"
    })
}
module.exports = {
    afterCreate() {
        revalidateStaticSite()
    },

    afterUpdate() {
        revalidateStaticSite()
    },
    afterDelete(){
        revalidateStaticSite()
    }
  };