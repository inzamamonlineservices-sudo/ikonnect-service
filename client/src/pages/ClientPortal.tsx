import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  FolderOpen, 
  Calendar, 
  FileText, 
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  budget?: number;
  deadline?: string;
  milestones: {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
  }[];
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('projects');
  
  // Mock authentication check - in real app this would be handled by auth system
  const isAuthenticated = true; // This would come from your auth context
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/client/projects'],
    enabled: isAuthenticated
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Client Portal Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              Please log in to access your client portal
            </p>
            <Button className="w-full" data-testid="button-login">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">Loading your projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Portal</h1>
          <p className="text-gray-600 mt-2">Track your projects and collaborate with our team</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              My Projects
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid gap-6">
              {projects?.map((project: Project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentsSection projects={projects || []} />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <CalendarSection projects={projects || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'planning': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'review': return <AlertCircle className="w-4 h-4" />;
      default: return <FolderOpen className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              {project.title}
              {getStatusIcon(project.status)}
            </CardTitle>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace('_', ' ')}
            </Badge>
            {project.budget && (
              <Badge variant="outline" className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {project.budget.toLocaleString()}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {project.deadline && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Deadline: {format(new Date(project.deadline), 'PPP')}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {project.milestones.filter(m => m.completed).length} of {project.milestones.length} milestones completed
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            data-testid={`button-expand-project-${project.id}`}
          >
            {expanded ? 'Less Details' : 'View Details'}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div>
              <h4 className="font-semibold mb-2">Milestones</h4>
              <div className="space-y-2">
                {project.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle 
                      className={`w-4 h-4 ${milestone.completed ? 'text-green-600' : 'text-gray-300'}`}
                    />
                    <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                      {milestone.title}
                    </span>
                    {milestone.dueDate && (
                      <span className="text-muted-foreground ml-auto">
                        Due: {format(new Date(milestone.dueDate), 'PP')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {project.attachments.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Project Files</h4>
                <div className="space-y-2">
                  {project.attachments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {file.type}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        data-testid={`button-download-${file.id}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DocumentsSection({ projects }: { projects: Project[] }) {
  const allFiles = projects.flatMap(p => 
    p.attachments.map(a => ({ ...a, projectTitle: p.title }))
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Document Library</h2>
      <div className="grid gap-4">
        {allFiles.map((file) => (
          <Card key={file.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">From: {file.projectTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{file.type}</Badge>
                  <Button size="sm" variant="outline" data-testid={`button-download-doc-${file.id}`}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CalendarSection({ projects }: { projects: Project[] }) {
  const upcomingDeadlines = projects
    .filter(p => p.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  const upcomingMilestones = projects
    .flatMap(p => 
      p.milestones
        .filter(m => !m.completed && m.dueDate)
        .map(m => ({ ...m, projectTitle: p.title }))
    )
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upcoming Schedule</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((project) => (
                <div key={project.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-muted-foreground">{project.progress}% complete</p>
                  </div>
                  <Badge variant="outline">
                    {format(new Date(project.deadline!), 'MMM dd')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {upcomingMilestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{milestone.title}</p>
                      <p className="text-xs text-muted-foreground">{milestone.projectTitle}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {format(new Date(milestone.dueDate!), 'MMM dd')}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}