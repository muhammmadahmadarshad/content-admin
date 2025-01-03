const { revalidateStaticSite } = require('./revalidate');

const createClient  = require('@supabase/supabase-js').createClient

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY


function getSupbase (){
    console.log(SUPABASE_KEY, SUPABASE_URL)
    return createClient(SUPABASE_URL, SUPABASE_KEY);
}

const subscribeToChanges = (strapi) => {
    const knex = strapi.db.connection;
    getSupbase()
      .channel('leads')  // Subscribe to the 'leads' table
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' },async (payload) => {
        if(!payload.new.strapi_id){
            const {title, description, created_at, updated_at, id} =payload.new;
        const entry = await strapi.db.query('api::lead.lead').create( {
                data: {
                  title,
                  description, supabaseId: id,
                  createdAt: created_at,
                  updatedAt: updated_at
                },
              });
              await getSupbase()
              .from('leads')
              .update({
                  strapi_id: entry.id,
              })
              .eq('id',id )

              revalidateStaticSite()
        }

       
        
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' },async (payload) => {
        await knex("leads").where({supabase_id: payload.new.id}).update({
            title: payload.new.title,
            description: payload.new.description,
            created_at: payload.new.created_at,
            updated_at: payload.new.updated_at,
            supabase_id: payload.new.id
        })
        revalidateStaticSite()
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'leads' },async (payload) => {
        await knex('leads')
        .where({ supabase_id: payload.old.id }) // Specify the condition
        .del(); 
        revalidateStaticSite()
        })
      .subscribe();
  };

  
module.exports ={
    getSupbase,
    subscribeToChanges
}