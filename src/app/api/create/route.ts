import promisePool from '@/lib/mysql';

export async function GET() {

	const db = await promisePool.getConnection();

	await db.query(`
      CREATE TABLE IF NOT EXISTS sessions
      (
          id          int unsigned auto_increment primary key,
          readable_id tinytext not null
      )
	`);

	await db.query(`
      CREATE TABLE IF NOT EXISTS events
      (
          id         int unsigned auto_increment primary key,
          session_id int unsigned not null,
          time       datetime     not null,
          amount     int unsigned not null,
          constraint events_sessions_id_fk foreign key (session_id) references sessions (id)
      )
	`);

	db.release();
	return Response.json({message: 'ok'});
}
