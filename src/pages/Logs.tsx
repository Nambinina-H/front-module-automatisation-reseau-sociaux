
import React, { useEffect, useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState
} from '@tanstack/react-table';
import { useLogs } from '@/hooks/useApi';
import { Log } from '@/services/apiService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, Filter, Search } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const columnHelper = createColumnHelper<Log>();

const LogsPage = () => {
  const { logs, fetchLogs, downloadLogs, loading } = useLogs();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const actions = [
    { value: 'login', label: 'Connexion' },
    { value: 'logout', label: 'Déconnexion' },
    { value: 'generate_content', label: 'Génération de contenu' },
    { value: 'register', label: 'Inscription' },
    { value: 'update_profile', label: 'Mise à jour du profil' },
  ];

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'login':
        return 'default';
      case 'logout':
        return 'secondary';
      case 'generate_content':
        return 'outline';
      case 'register':
        return 'default';
      case 'update_profile':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const columns = [
    columnHelper.accessor('email', {
      header: 'Utilisateur',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('action', {
      header: 'Action',
      cell: info => (
        <Badge variant={getActionBadgeVariant(info.getValue())}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('details', {
      header: 'Détails',
      cell: info => <span className="line-clamp-2">{info.getValue()}</span>,
    }),
    columnHelper.accessor('created_at', {
      header: 'Date',
      cell: info => {
        const date = new Date(info.getValue());
        return format(date, 'dd MMM yyyy HH:mm', { locale: fr });
      },
    }),
  ];

  const table = useReactTable({
    data: logs || [],
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: searchTerm,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearchTerm,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    const fetchLogsData = async () => {
      await fetchLogs();
    };
    fetchLogsData();
  }, [fetchLogs]);

  const handleFilterChange = () => {
    // Reset page when filters change
    setPage(1);
    fetchLogs();
  };

  const handleDownload = (format: 'csv' | 'json') => {
    downloadLogs(format);
  };

  return (
    <div className="container p-6 mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Journal d'activités</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDownload('csv')}
          >
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDownload('json')}
          >
            <Download className="mr-2 h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={actionFilter}
                onValueChange={(value) => {
                  setActionFilter(value);
                  setColumnFilters(prev => {
                    const filtered = prev.filter(filter => filter.id !== 'action');
                    if (value) {
                      return [...filtered, { id: 'action', value }];
                    }
                    return filtered;
                  });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{actionFilter ? `Action: ${actionFilter}` : 'Filtrer par action'}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  {actions.map(action => (
                    <SelectItem key={action.value} value={action.value}>{action.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleFilterChange}>
                Appliquer
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading.fetch ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Chargement...</span>
            </div>
          ) : (
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      Aucun log trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {/* Fix: Removed disabled prop and conditionally render based on whether we can go to previous page */}
                {table.getCanPreviousPage() ? (
                  <PaginationPrevious onClick={() => table.previousPage()} />
                ) : (
                  <span className="flex items-center gap-1 p-2 text-gray-400 cursor-not-allowed">
                    <span className="h-4 w-4">◄</span>
                    <span>Previous</span>
                  </span>
                )}
              </PaginationItem>
              
              {Array.from({ length: table.getPageCount() }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={table.getState().pagination.pageIndex === i}
                    onClick={() => table.setPageIndex(i)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                {/* Fix: Removed disabled prop and conditionally render based on whether we can go to next page */}
                {table.getCanNextPage() ? (
                  <PaginationNext onClick={() => table.nextPage()} />
                ) : (
                  <span className="flex items-center gap-1 p-2 text-gray-400 cursor-not-allowed">
                    <span>Next</span>
                    <span className="h-4 w-4">►</span>
                  </span>
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
