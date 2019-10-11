module.exports= (router)=>{
    router.post('/fetchItem',async(ctx,next)=>{
        const query=ctx.request.body;
        const string=query.id===1? 'nice to meet u' : 'wrong Id';
        ctx.body={
            item:string
        }
    })


}
