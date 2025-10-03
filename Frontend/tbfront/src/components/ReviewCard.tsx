'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/app/store/authStore"

type Review = {
  id: number
  user: string
  comment: string
  rating: number
  date?: string
}

export default function ReviewCard({
  review,
  onEdit,
  onDelete,
}: {
  review: Review
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}) {
  const currentUser = useAuthStore((s) => s.user)

  return (
    <Card className="p-4">
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="font-semibold">{review.user}</p>
            {review.date && (
              <p className="text-xs text-gray-500">Reviewed on {review.date}</p>
            )}
          </div>
          <p className="text-yellow-500 text-sm">
            {"⭐".repeat(review.rating)}{" "}
            <span className="text-gray-400">({review.rating}/5)</span>
          </p>
        </div>

        <p className="text-gray-700 text-sm">{review.comment}</p>

        
        {currentUser?.name === review.user && (
          <div className="flex gap-2 mt-3">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(review.id)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(review.id)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
