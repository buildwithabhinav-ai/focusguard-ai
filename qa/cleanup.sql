-- Removes every throw-away "qa-tmp*" account/organisation left by the test scripts and
-- clears notification noise on the demo admin accounts so the tester starts from a clean bell.
delete from deactivation_requests where organization_id in (select id from organizations where organization_name like 'qa-tmp%')
   or requested_by in (select id from users where email like 'qa-tmp%');
delete from focus_plan_items where plan_id in (select id from focus_plans where user_id in (select id from users where email like 'qa-tmp%'));
delete from focus_plans where user_id in (select id from users where email like 'qa-tmp%');
delete from activity_logs where user_id in (select id from users where email like 'qa-tmp%');
delete from tab_switch_logs where user_id in (select id from users where email like 'qa-tmp%');
delete from user_status_logs where user_id in (select id from users where email like 'qa-tmp%');
delete from user_status where user_id in (select id from users where email like 'qa-tmp%');
delete from notifications where user_id in (select id from users where email like 'qa-tmp%');
delete from users where email like 'qa-tmp%';
delete from organizations where organization_name like 'qa-tmp%';
delete from notifications where user_id in (select id from users where email in
  ('demo.superadmin@example.com','demo.subadmin@example.com','demo.subadmin.beta@example.com'));
-- demo employees keep only their welcome notification, unread
delete from notifications where user_id in (select id from users where email like 'demo.employee%@example.com' or email='demo.user@example.com')
  and notification_type <> 'USER_CREATED';
update notifications set is_read = false where user_id in (select id from users where email like 'demo.employee%@example.com');
-- demo browsing history / plans are rebuilt with:  ./venv/bin/python qa/seed_demo.py --reset-data
