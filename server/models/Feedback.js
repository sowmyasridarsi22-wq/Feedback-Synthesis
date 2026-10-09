import mongoose from 'mongoose';
const schema=new mongoose.Schema({originalFeedback:{type:String,required:true},source:String,date:Date,rating:Number,product:String,category:String,sentiment:String,sentimentScore:Number,topic:String,subtopic:String,issue:String,severity:String,keywords:[String],featureRequest:Boolean,requestedFeature:String,similarityGroup:String,aiSummary:String,processingStatus:{type:String,default:'Pending'},analysisSource:String,datasetId:String,metadata:mongoose.Schema.Types.Mixed},{timestamps:true});
schema.index({originalFeedback:'text'}); schema.index({datasetId:1,date:1});
export default mongoose.model('Feedback',schema);
