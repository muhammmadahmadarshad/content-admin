const { revalidateStaticSite } = require("../../../../utils/revalidate");
const supabase = require("../../../../utils/supabase");


module.exports = {
    async afterCreate(event) {
    
        const {result} = event
        if(!result.supabaseId)
        await supabase.getSupbase().from('leads').insert([{title: result.title, description: result.description, strapi_id: result.id, created_at: result.createdAt, updated_at: result.updatedAt}])
        revalidateStaticSite()
    },

   async afterUpdate(event) {
        revalidateStaticSite()
        const {result} = event
        
        await supabase.getSupbase()
        .from('leads')
        .update({
            title: result.title, 
            description: result.description,
            strapi_id: result.strapi_id,
            created_at: result.createdAt,
            updated_at: result.updatedAt
        })
        .eq('strapi_id',result.id )
        revalidateStaticSite()
    },
   async afterDelete(event){
        const {result} = event
        await supabase.getSupbase().from('leads').delete().eq('strapi_id', result.id);
        revalidateStaticSite()
    }
  };