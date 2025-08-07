import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Clock, 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Settings,
  Play,
  Timer
} from 'lucide-react'

/**
 * SessionTimeoutGuide - Complete documentation for session timeout system
 * 
 * Explains configuration, behavior, and testing procedures
 */
export function SessionTimeoutGuide() {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-6 w-6" />
            Session Timeout Management
          </CardTitle>
          <CardDescription>
            Comprehensive guide to the clinical session timeout and security system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The Session Timeout Management system provides enterprise-grade session security 
            specifically designed for clinical environments. It balances security requirements 
            with the need for uninterrupted patient care.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Security First</h3>
              <p className="text-sm text-muted-foreground">
                Automatic logout prevents unauthorized access
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Activity className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Activity Aware</h3>
              <p className="text-sm text-muted-foreground">
                Smart detection of user activity extends sessions
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Clock className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Progressive Warnings</h3>
              <p className="text-sm text-muted-foreground">
                Multi-level alerts before session expiration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <CardDescription>
            Advanced capabilities designed for healthcare workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Automatic Session Extension</h4>
                <p className="text-sm text-muted-foreground">
                  Detects user activity (mouse, keyboard, scroll) and automatically extends the session 
                  to prevent interruption during active work. Configurable per user role.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Progressive Warning System</h4>
                <p className="text-sm text-muted-foreground">
                  Three-tier warning system: Early (5 min), Urgent (2 min), and Critical (30 sec) 
                  alerts with different visual and behavioral cues.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Active Session Protection</h4>
                <p className="text-sm text-muted-foreground">
                  Special handling for active therapy sessions to prevent interruption of patient care.
                  Enhanced confirmation dialogs for critical workflows.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Role-Based Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  Different timeout periods for therapists (30 min) and patients (60 min) 
                  based on typical usage patterns and security requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Security Event Logging</h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive logging of login attempts, session extensions, timeouts, 
                  and security events for audit compliance.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Options
          </CardTitle>
          <CardDescription>
            Customizable settings for different clinical workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Default Settings */}
            <div>
              <h4 className="font-medium mb-3">Default Settings by Role</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">Therapist</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Session Timeout:</span>
                      <span className="font-mono">30 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Warning Time:</span>
                      <span className="font-mono">5 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto-extend:</span>
                      <span className="font-mono">Enabled</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Patient</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Session Timeout:</span>
                      <span className="font-mono">60 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Warning Time:</span>
                      <span className="font-mono">10 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto-extend:</span>
                      <span className="font-mono">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Advanced Options */}
            <div>
              <h4 className="font-medium mb-3">Advanced Configuration</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <span className="font-medium">Activity Indicator</span>
                    <p className="text-xs text-muted-foreground">Show floating timer in corner</p>
                  </div>
                  <Badge variant="outline">Optional</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <span className="font-medium">Security Logging</span>
                    <p className="text-xs text-muted-foreground">Track all session events</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <span className="font-medium">Emergency Session Mode</span>
                    <p className="text-xs text-muted-foreground">Prevent timeout during critical care</p>
                  </div>
                  <Badge variant="default">Automatic</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Warning Level Behavior</CardTitle>
          <CardDescription>
            How the system behaves at different timeout stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Normal Operation</h4>
                <p className="text-sm text-green-700">
                  Session active, no warnings. Activity indicator shows green status.
                  Automatic extension occurs on any user activity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Early Warning (5 minutes)</h4>
                <p className="text-sm text-yellow-700">
                  Subtle notification appears. Activity indicator turns yellow.
                  Dialog may appear for non-critical workflows.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800">Urgent Warning (2 minutes)</h4>
                <p className="text-sm text-orange-700">
                  Modal dialog appears with extend options. Activity indicator turns orange.
                  User must take action to continue session.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Critical Warning (30 seconds)</h4>
                <p className="text-sm text-red-700">
                  Blocking modal with countdown. Activity indicator flashes red.
                  Automatic logout in 30 seconds unless action taken.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Testing & Validation
          </CardTitle>
          <CardDescription>
            Use the built-in testing tools to validate behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Use the "Session Timeout Test" page to simulate different scenarios 
                with accelerated timeouts (30 seconds instead of 30 minutes) for rapid testing.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-medium">Test Scenarios Available:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 border rounded">
                  <Badge variant="default" className="mb-2">Normal</Badge>
                  <p className="text-sm text-muted-foreground">
                    Standard timeout behavior with auto-extension
                  </p>
                </div>
                
                <div className="p-3 border rounded">
                  <Badge variant="destructive" className="mb-2">Emergency</Badge>
                  <p className="text-sm text-muted-foreground">
                    Simulates active therapy session protection
                  </p>
                </div>
                
                <div className="p-3 border rounded">
                  <Badge variant="secondary" className="mb-2">Quick Test</Badge>
                  <p className="text-sm text-muted-foreground">
                    30-second timeout for rapid validation
                  </p>
                </div>
                
                <div className="p-3 border rounded">
                  <Badge variant="outline" className="mb-2">Inactive</Badge>
                  <p className="text-sm text-muted-foreground">
                    No auto-extension, tests manual intervention
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Considerations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Considerations
          </CardTitle>
          <CardDescription>
            Important security aspects of the timeout system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Critical:</strong> Session timeouts are essential for GDPR/LGPD compliance 
                in healthcare environments. Never disable timeout functionality in production.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Data Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatic logout prevents unauthorized access to patient data 
                    when devices are left unattended.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Activity Monitoring</h4>
                  <p className="text-sm text-muted-foreground">
                    All user activity is monitored but not logged for privacy. 
                    Only security events are recorded for audit purposes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Session Persistence</h4>
                  <p className="text-sm text-muted-foreground">
                    Session state is stored securely and survives browser refreshes. 
                    Full logout clears all persistent session data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Details</CardTitle>
          <CardDescription>
            Technical information for developers and administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Components</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• SessionTimeoutManager (main component)</li>
                  <li>• useSessionTimeout (hook)</li>
                  <li>• useActivityTracker (activity detection)</li>
                  <li>• useSessionSecurity (logging)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Storage</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• session-last-activity (timestamp)</li>
                  <li>• session-start-time (session start)</li>
                  <li>• session-config (user preferences)</li>
                  <li>• session-security-events (audit log)</li>
                </ul>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Activity Detection Events</h4>
              <div className="flex flex-wrap gap-2">
                {['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'focus'].map(event => (
                  <Badge key={event} variant="outline" className="text-xs">
                    {event}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}