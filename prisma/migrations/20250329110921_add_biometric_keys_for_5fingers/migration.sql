-- CreateTable
CREATE TABLE "Biometric" (
    "id" TEXT NOT NULL,
    "right_thumb_finger" TEXT NOT NULL,
    "right_index_finger" TEXT NOT NULL,
    "right_middle_finger" TEXT NOT NULL,
    "right_ring_finger" TEXT NOT NULL,
    "right_short_finger" TEXT NOT NULL,
    "left_thumb_finger" TEXT NOT NULL,
    "left_index_finger" TEXT NOT NULL,
    "left_middle_finger" TEXT NOT NULL,
    "left_ring_finger" TEXT NOT NULL,
    "left_short_finger" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Biometric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_right_thumb_finger_key" ON "Biometric"("right_thumb_finger");

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_right_index_finger_key" ON "Biometric"("right_index_finger");

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_right_middle_finger_key" ON "Biometric"("right_middle_finger");

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_right_ring_finger_key" ON "Biometric"("right_ring_finger");

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_right_short_finger_key" ON "Biometric"("right_short_finger");

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_left_thumb_finger_key" ON "Biometric"("left_thumb_finger");

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_left_index_finger_key" ON "Biometric"("left_index_finger");

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_left_middle_finger_key" ON "Biometric"("left_middle_finger");

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_left_ring_finger_key" ON "Biometric"("left_ring_finger");

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_left_short_finger_key" ON "Biometric"("left_short_finger");

-- AddForeignKey
ALTER TABLE "Biometric" ADD CONSTRAINT "Biometric_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
