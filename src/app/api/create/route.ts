import promisePool from '@/lib/mysql';

export async function GET() {

	await promisePool.query(`
      CREATE TABLE IF NOT EXISTS sessions
      (
          id          int unsigned auto_increment primary key,
          readable_id tinytext not null
      )
	`);

	await promisePool.query(`
      CREATE TABLE IF NOT EXISTS events
      (
          session_id int unsigned not null,
          time       datetime     not null,
          amount     int unsigned not null,
          constraint events_sessions_id_fk foreign key (session_id) references sessions (id)
      )
	`);

	return Response.json({message: 'ok'});
}
