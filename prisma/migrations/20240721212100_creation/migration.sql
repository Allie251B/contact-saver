-- CreateTable
CREATE TABLE "GitHubUsers" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountCreationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domains" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_domains" (
    "userId" INTEGER NOT NULL,
    "domainId" INTEGER NOT NULL,
    "recordId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_domains_pkey" PRIMARY KEY ("userId","domainId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubUsers_username_key" ON "GitHubUsers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Domains_name_key" ON "Domains"("name");

-- AddForeignKey
ALTER TABLE "user_domains" ADD CONSTRAINT "user_domains_userId_fkey" FOREIGN KEY ("userId") REFERENCES "GitHubUsers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_domains" ADD CONSTRAINT "user_domains_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
