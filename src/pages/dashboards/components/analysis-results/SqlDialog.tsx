
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface SqlDialogProps {
  sql: string | { nodes_sql?: string; edges_sql?: string } | null | undefined;
}

const SqlDialog: React.FC<SqlDialogProps> = ({ sql }) => {
  if (!sql) return null;
  
  const hasSqlObject = sql && typeof sql === 'object';
  const hasSqlString = sql && typeof sql === 'string';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 h-6 px-2 py-1 text-xs"
        >
          <Code className="h-3.5 w-3.5 mr-1" />
          SQL
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>SQL Query</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-auto max-h-[60vh]">
          {hasSqlString && (
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto whitespace-pre-wrap text-xs">
              {sql as string}
            </pre>
          )}
          
          {hasSqlObject && (
            <Tabs defaultValue="nodes" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="nodes">Nodes SQL</TabsTrigger>
                <TabsTrigger value="edges">Edges SQL</TabsTrigger>
              </TabsList>
              <TabsContent value="nodes" className="mt-0">
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto whitespace-pre-wrap text-xs">
                  {(sql as {nodes_sql?: string}).nodes_sql || 'No nodes SQL available'}
                </pre>
              </TabsContent>
              <TabsContent value="edges" className="mt-0">
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto whitespace-pre-wrap text-xs">
                  {(sql as {edges_sql?: string}).edges_sql || 'No edges SQL available'}
                </pre>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SqlDialog;
