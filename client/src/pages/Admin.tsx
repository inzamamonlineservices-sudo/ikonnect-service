import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit,
  Trash2,
  MessageSquare,
  TrendingUp,
  Eye,
  Clock
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { insertCmsContentSchema, insertClientSchema, insertClientProjectSchema } from '@shared/schema';
import { z } from 'zod';

const cmsContentFormSchema = insertCmsContentSchema.extend({
  metadata: z.record(z.any()).optional()
});

const clientFormSchema = insertClientSchema;
const projectFormSchema = insertClientProjectSchema.extend({
  milestones: z.array(z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean(),
    dueDate: z.string().optional()
  })).optional(),
  attachments: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    type: z.string()
  })).optional()
});

export default function Admin() {
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Analytics data
  const { data: analyticsData } = useQuery<any>({
    queryKey: ['/api/analytics/summary'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // CMS content data
  const { data: cmsContent } = useQuery<any[]>({
    queryKey: ['/api/cms/content']
  });

  // Clients data
  const { data: clients } = useQuery<any[]>({
    queryKey: ['/api/admin/clients']
  });

  // Projects data
  const { data: projects } = useQuery<any[]>({
    queryKey: ['/api/admin/projects']
  });

  // Chat conversations
  const { data: chatData } = useQuery<any[]>({
    queryKey: ['/api/chat/conversations']
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your digital agency platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="cms" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              CMS
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard data={analyticsData} />
          </TabsContent>

          <TabsContent value="cms" className="space-y-6">
            <CMSDashboard content={cmsContent || []} />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <ClientsDashboard clients={clients || []} />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <ProjectsDashboard projects={projects || []} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <ChatDashboard conversations={chatData || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AnalyticsDashboard({ data }: { data: any }) {
  if (!data) {
    return <div className="text-center py-8">Loading analytics data...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalPageViews}</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.uniqueVisitors}</div>
          <p className="text-xs text-muted-foreground">+8% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(data.bounceRate * 100)}%</div>
          <p className="text-xs text-muted-foreground">-3% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2m 34s</div>
          <p className="text-xs text-muted-foreground">+15% from last month</p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topPages?.map((page: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="font-medium">{page.page}</div>
                <Badge variant="secondary">{page.views} views</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CMSDashboard({ content }: { content: any[] }) {
  const [editingContent, setEditingContent] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(cmsContentFormSchema),
    defaultValues: {
      type: 'page',
      key: '',
      title: '',
      content: '',
      published: true
    }
  });

  const createContentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/cms/content', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/content'] });
      setShowCreateForm(false);
      form.reset();
    }
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ key, data }: { key: string; data: any }) => {
      return apiRequest(`/api/cms/content/${key}`, 'PUT', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/content'] });
      setEditingContent(null);
    }
  });

  const onSubmit = (data: any) => {
    if (editingContent) {
      updateContentMutation.mutate({ key: editingContent.key, data });
    } else {
      createContentMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <Button onClick={() => setShowCreateForm(true)} data-testid="button-create-content">
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </Button>
      </div>

      {(showCreateForm || editingContent) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingContent ? 'Edit Content' : 'Create New Content'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-content-type">
                              <SelectValue placeholder="Select content type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="page">Page</SelectItem>
                            <SelectItem value="section">Section</SelectItem>
                            <SelectItem value="component">Component</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key</FormLabel>
                        <FormControl>
                          <Input placeholder="unique-content-key" {...field} data-testid="input-content-key" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Content Title" {...field} data-testid="input-content-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your content here..." 
                          className="min-h-32"
                          {...field} 
                          data-testid="textarea-content-body"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Published</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Make this content visible on the website
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-content-published"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit" data-testid="button-save-content">
                    {editingContent ? 'Update' : 'Create'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingContent(null);
                      form.reset();
                    }}
                    data-testid="button-cancel-content"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {content?.map((item: any) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge variant={item.published ? 'default' : 'secondary'}>
                      {item.published ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Key: {item.key}</p>
                  <p className="text-sm">{item.content.substring(0, 150)}...</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setEditingContent(item);
                      form.reset({
                        type: item.type,
                        key: item.key,
                        title: item.title,
                        content: item.content,
                        published: item.published
                      });
                    }}
                    data-testid={`button-edit-content-${item.id}`}
                  >
                    <Edit className="w-4 h-4" />
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

function ClientsDashboard({ clients }: { clients: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button data-testid="button-create-client">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="grid gap-4">
        {clients?.map((client: any) => (
          <Card key={client.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{client.firstName} {client.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                  {client.company && <p className="text-sm">{client.company}</p>}
                </div>
                <Badge variant={client.active ? 'default' : 'secondary'}>
                  {client.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProjectsDashboard({ projects }: { projects: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button data-testid="button-create-project">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects?.map((project: any) => (
          <Card key={project.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Progress: {project.progress}%</span>
                  {project.budget && <span>Budget: ${project.budget}</span>}
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ChatDashboard({ conversations }: { conversations: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chat Conversations</h2>
      </div>

      <div className="grid gap-4">
        {conversations?.map((conversation: any) => (
          <Card key={conversation.id}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Session: {conversation.sessionId}</h3>
                  <Badge variant={conversation.resolved ? 'default' : 'secondary'}>
                    {conversation.resolved ? 'Resolved' : 'Open'}
                  </Badge>
                </div>
                <p className="text-sm"><strong>User:</strong> {conversation.userQuery}</p>
                <p className="text-sm"><strong>Bot:</strong> {conversation.botResponse}</p>
                {conversation.satisfaction && (
                  <p className="text-sm text-muted-foreground">
                    Satisfaction: {conversation.satisfaction}/5
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}