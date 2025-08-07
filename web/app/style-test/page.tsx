'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function StyleTest() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-bold text-primary">CSS Style Test</h1>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This is a test card to verify CSS is working properly.
          </p>
          <div className="space-x-2">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
          <div className="mt-4 space-x-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-primary text-primary-foreground rounded-lg">
        <p>Primary background with primary foreground text</p>
      </div>
      
      <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
        <p>Secondary background with secondary foreground text</p>
      </div>
    </div>
  )
}
