CREATE TABLE "file" (
	"id" serial NOT NULL,
	"name" varchar(250) NOT NULL,
	"description" varchar(500) NOT NULL,
	"link" varchar(1024) NOT NULL,
	"archived" TIMESTAMP,
	CONSTRAINT "File_pk" PRIMARY KEY ("id")
);

CREATE TABLE "history" (
	"id" serial NOT NULL,
	"version" integer NOT NULL,
	"file_id" integer NOT NULL,
	"comment" varchar(500),
	"date_created" TIMESTAMP NOT NULL,
	"link" varchar(1024) NOT NULL,
	CONSTRAINT "History_pk" PRIMARY KEY ("id")
);

ALTER TABLE "history" ADD CONSTRAINT "History_fk0" FOREIGN KEY ("file_id") REFERENCES "file"("id");



