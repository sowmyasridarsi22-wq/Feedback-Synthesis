const aliases={
  feedback:['feedback','review','review_text','feedback_text','customer_feedback','comment','comments','message','text','content','reviewtext','feedbacktext'],
  date:['date','feedback_date','review_date','created_at','timestamp','submitted_at','createdat','reviewdate','feedbackdate'],
  rating:['rating','score','stars','customer_rating','review_rating'],
  sentiment:['sentiment','polarity','label'],
  product:['product','product_name','product name','item','item_name','item name','product_title','product title','product_category'],
  category:['category','type','classification','product_category','feedback_category'],
  source:['source','channel','origin','platform','feedback_source']
};

function normalize(value){
  return String(value||'').toLowerCase().trim().replace(/[\s_-]+/g,'');
}

export function detectColumns(headers){
  const normalized={};
  for(const header of headers) normalized[normalize(header)]=header;

  const result={};
  for(const [field,names] of Object.entries(aliases)){
    result[field]=names.map(normalize).map(name=>normalized[name]).find(Boolean)||null;
  }
  return result;
}
