CREATE TYPE "widgettype" AS ENUM (
  'header',
  'list',
  'alert',
  'statictable'
);

CREATE TABLE "users" (
  "_id" SERIAL PRIMARY KEY,
  "email" TEXT,
  "password" TEXT
);

CREATE TABLE "projects" (
  "_id" SERIAL PRIMARY KEY,
  "projectName" TEXT,
  "ownerId" INTEGER
);

CREATE TABLE "userprojects" (
  "_id" SERIAL PRIMARY KEY,
  "userId" INTEGER,
  "projectId" INTEGER
);

CREATE TABLE "tables" (
  "_id" SERIAL PRIMARY KEY,
  "key" TEXT NOT NULL,
  "name" TEXT,
  "ownerId" INTEGER
);

CREATE TABLE "projecttables" (
  "_id" SERIAL PRIMARY KEY,
  "projectId" INTEGER,
  "tableId" INTEGER
);

CREATE TABLE "columns" (
  "_id" SERIAL PRIMARY KEY,
  "columnName" TEXT,
  "tableId" INTEGER,
  "type" TEXT NOT NULL DEFAULT 'string'
);

CREATE TABLE "pages" (
  "_id" SERIAL PRIMARY KEY,
  "path" varchar(255),
  "name" varchar(255),
  "projectId" INTEGER,
  "metadataId" INTEGER
);

CREATE TABLE "widgets" (
  "_id" SERIAL PRIMARY KEY,
  "type" widgettype,
  "data" json,
  "pageId" INTEGER
);

CREATE TABLE "metadata" (
  "_id" SERIAL PRIMARY KEY,
  "visible" boolean,
  "pageId" INTEGER
);

CREATE TABLE "settings" (
  "_id" SERIAL PRIMARY KEY,
  "name" varchar(255),
  "homePath" varchar(255),
  "projectId" INTEGER
);

ALTER TABLE "widgets" ADD FOREIGN KEY ("pageId") REFERENCES "pages" ("_id");

ALTER TABLE "settings" ADD FOREIGN KEY ("projectId") REFERENCES "projects" ("_id");

ALTER TABLE "metadata" ADD FOREIGN KEY ("pageId") REFERENCES "pages" ("_id");

ALTER TABLE "projects" ADD FOREIGN KEY ("ownerId") REFERENCES "users" ("_id");

ALTER TABLE "userprojects" ADD FOREIGN KEY ("userId") REFERENCES "users" ("_id");

ALTER TABLE "userprojects" ADD FOREIGN KEY ("projectId") REFERENCES "projects" ("_id");

ALTER TABLE "tables" ADD FOREIGN KEY ("ownerId") REFERENCES "users" ("_id");

ALTER TABLE "projecttables" ADD FOREIGN KEY ("projectId") REFERENCES "projects" ("_id");

ALTER TABLE "projecttables" ADD FOREIGN KEY ("tableId") REFERENCES "tables" ("_id");

ALTER TABLE "columns" ADD FOREIGN KEY ("tableId") REFERENCES "tables" ("_id");