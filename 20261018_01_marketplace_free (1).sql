// Non-UI Supabase API adapter. Adapt to your existing auth-client.js and script.js.
// Supabase RLS, not this client, enforces actual authorization.
import { supabase } from './supabase-client.example.js';

async function unwrap(promise) {
  const {data, error} = await promise;
  if (error) throw error;
  return data;
}

export async function signUp(email, password) {
  return unwrap(supabase.auth.signUp({ email, password }));
}
export async function signIn(email, password) {
  return unwrap(supabase.auth.signInWithPassword({ email, password }));
}
export async function signOut() { return unwrap(supabase.auth.signOut()); }
export async function currentUser() {
  const {data:{user},error} = await supabase.auth.getUser();
  if(error) throw error;
  return user;
}
export async function saveOwnProfile(displayName) {
  const user=await currentUser();
  if(!user) throw new Error('Login required');
  const existing=await unwrap(supabase.from('bf_profiles').select('user_id').eq('user_id',user.id).maybeSingle());
  if(existing) return unwrap(supabase.from('bf_profiles').update({display_name:displayName,updated_at:new Date().toISOString()}).eq('user_id',user.id).select());
  return unwrap(supabase.from('bf_profiles').insert({user_id:user.id,display_name:displayName}).select());
}
export async function listPublishedCourses() {
  return unwrap(supabase.from('bf_courses').select('id,slug,title,summary,category,language,difficulty,estimated_minutes,price_cents,currency')
    .eq('status','published').order('created_at',{ascending:false}));
}
export async function applyAsCreator(pitch,portfolioUrl=null) {
  const user=await currentUser();
  if(!user) throw new Error('Login required');
  return unwrap(supabase.from('bf_creator_applications').insert({applicant_id:user.id,pitch,portfolio_url:portfolioUrl}).select());
}
export async function createDraft({slug,title,summary='',category='general',difficulty='beginner',estimatedMinutes=0}) {
  const user=await currentUser();
  if(!user) throw new Error('Login required');
  return unwrap(supabase.from('bf_courses').insert({creator_id:user.id,slug,title,summary,category,difficulty,estimated_minutes:estimatedMinutes,price_cents:0}).select());
}
export async function enrollFreeCourse(courseId) {
  return unwrap(supabase.rpc('bf_enroll_free_course',{p_course_id:courseId}));
}
export async function myProgress() {
  const user=await currentUser();
  if(!user) throw new Error('Login required');
  return unwrap(supabase.from('bf_progress').select('course_id,lesson_id,state,updated_at').eq('learner_id',user.id));
}
export async function markLesson(courseId,lessonId,complete) {
  const user=await currentUser();
  if(!user) throw new Error('Login required');
  const existing=await unwrap(supabase.from('bf_progress').select('lesson_id').eq('learner_id',user.id).eq('lesson_id',lessonId).maybeSingle());
  if(existing) return unwrap(supabase.from('bf_progress').update({state:complete?'completed':'started',updated_at:new Date().toISOString()}).eq('learner_id',user.id).eq('lesson_id',lessonId).select());
  return unwrap(supabase.from('bf_progress').insert({learner_id:user.id,course_id:courseId,lesson_id:lessonId,state:complete?'completed':'started'}).select());
}
