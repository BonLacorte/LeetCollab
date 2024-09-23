-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "password" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Problem" (
    "problemId" TEXT NOT NULL,
    "idTitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("problemId")
);

-- CreateTable
CREATE TABLE "Set" (
    "setId" TEXT NOT NULL,
    "setTitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("setId")
);

-- CreateTable
CREATE TABLE "ProblemSet" (
    "problemSetId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemSet_pkey" PRIMARY KEY ("problemSetId")
);

-- CreateTable
CREATE TABLE "LikedProblems" (
    "likedProblemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikedProblems_pkey" PRIMARY KEY ("likedProblemId")
);

-- CreateTable
CREATE TABLE "SolvedProblems" (
    "solvedProblemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolvedProblems_pkey" PRIMARY KEY ("solvedProblemId")
);

-- CreateTable
CREATE TABLE "StarredProblems" (
    "starredProblemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StarredProblems_pkey" PRIMARY KEY ("starredProblemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemSet_problemId_setId_key" ON "ProblemSet"("problemId", "setId");

-- CreateIndex
CREATE UNIQUE INDEX "LikedProblems_userId_problemId_key" ON "LikedProblems"("userId", "problemId");

-- CreateIndex
CREATE UNIQUE INDEX "SolvedProblems_userId_problemId_key" ON "SolvedProblems"("userId", "problemId");

-- CreateIndex
CREATE UNIQUE INDEX "StarredProblems_userId_problemId_key" ON "StarredProblems"("userId", "problemId");

-- AddForeignKey
ALTER TABLE "ProblemSet" ADD CONSTRAINT "ProblemSet_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("problemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemSet" ADD CONSTRAINT "ProblemSet_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("setId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedProblems" ADD CONSTRAINT "LikedProblems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedProblems" ADD CONSTRAINT "LikedProblems_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("problemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolvedProblems" ADD CONSTRAINT "SolvedProblems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolvedProblems" ADD CONSTRAINT "SolvedProblems_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("problemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarredProblems" ADD CONSTRAINT "StarredProblems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarredProblems" ADD CONSTRAINT "StarredProblems_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("problemId") ON DELETE RESTRICT ON UPDATE CASCADE;
