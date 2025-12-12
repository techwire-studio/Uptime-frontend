import { StatusPageStatusEnum, type RawStatusPagesType } from "@/types/status";
import EmptyState from "@/components/emptyState";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import PulseLoader from "@/components/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Users, Pause, Trash2, MoreHorizontal, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/constants";
import { toast } from "sonner";
import { MonitorCreationEnum } from "@/types/monitor";

const getStatusPages = async (workspaceId: string) => {
  const { data } = await axiosInstance.get(`/status/workspace/${workspaceId}`);
  return data;
};

export default function StatusPageCreator() {
  const navigate = useNavigate();

  const WORKSPACE_ID = "69ab2717-c9a7-4359-a254-91bcb0d12e12";

  const {
    data: statusResponse,
    isLoading: statusLoading,
    refetch,
  } = useQuery({
    queryKey: ["status-pages", WORKSPACE_ID],
    queryFn: () => getStatusPages(WORKSPACE_ID),
  });

  const statusPages: (RawStatusPagesType & { _count: { monitors: number } })[] =
    statusResponse?.data || [];

  if (statusLoading) return <PulseLoader />;

  const handleStatusPageStatus = async (
    id: string,
    status: StatusPageStatusEnum
  ) => {
    const { data } = await axiosInstance.patch(`status/${id}`, {
      status:
        status === StatusPageStatusEnum.PUBLISHED
          ? StatusPageStatusEnum.UNPUBLISHED
          : StatusPageStatusEnum.PUBLISHED,
    });

    if (data.success) {
      toast.success("Status Page edited successfully!");
      refetch();
    }
  };

  const handleStatusPageEdit = (id: string) => {
    navigate(
      `${Routes.CREATE_STATUS}?id=${id}&action=${MonitorCreationEnum.EDIT}`
    );
  };

  const handleDeleteStatusPage = async (id: string) => {
    const { data } = await axiosInstance.delete(`status/${id}`);

    if (data.success) {
      toast.success("Status Page deleted successfully!");
      refetch();
    }
  };

  return (
    <div className="min-h-screen text-gray-100">
      <header className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Status Pages<span className="text-green-500">.</span>
          </h1>

          <Button
            onClick={() => navigate(Routes.CREATE_STATUS)}
            className="px-4 py-2 rounded-lg bg-(--blue-color) transition font-medium text-sm"
          >
            Create Status Page
          </Button>
        </div>
      </header>

      <div className="p-6 pt-2">
        {statusPages.length === 0 && (
          <EmptyState
            title="Create your first"
            highlight="status page!"
            description="Showcase your service uptime with a beautiful status page. Communicate incidents and maintenances to your users with status pages and decent e-mails."
          />
        )}

        {statusPages.length > 0 && (
          <div className="bg-[#0F1623] border border-[#1f2837] rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-none">
                  <TableHead className="text-[#72839E] text-xs">Name</TableHead>
                  <TableHead className="text-[#72839E] text-xs">
                    Access level
                  </TableHead>
                  <TableHead className="text-[#72839E] text-xs">
                    Status
                  </TableHead>
                  <TableHead className="text-[#72839E] text-xs text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="bg-primary hover:bg-primary/70 rounded-lg">
                {statusPages.map((page) => (
                  <TableRow
                    key={page.id}
                    className="hover:bg-[#1A2535] transition"
                  >
                    <TableCell className="flex items-center gap-3 py-4">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                      </div>

                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-white">
                          {page.name}
                        </span>
                        <span className="text-xs text-[#72839E]">
                          {page._count.monitors} monitors
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-[#a7b0c0]">
                        <Users size={14} />
                        <span className="text-sm capitalize">
                          {page.access_level}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm capitalize text-[#a7b0c0]">
                        {page.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-[#1b2433] text-[#93a0b5]"
                          onClick={() =>
                            navigate(`${Routes.PUBLIC_STATUS}/${page.id}`)
                          }
                        >
                          <Eye size={18} />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-[#1b2433] text-[#93a0b5]"
                            >
                              <MoreHorizontal size={18} />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="w-40 bg-[#111827] border border-[#1f2937] rounded-md"
                          >
                            <DropdownMenuItem
                              onClick={() => handleStatusPageEdit(page.id)}
                              className="flex gap-2"
                            >
                              <Users size={16} /> Monitors
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusPageStatus(page.id, page.status)
                              }
                              className="flex gap-2"
                            >
                              {page.status ===
                              StatusPageStatusEnum.PUBLISHED ? (
                                <>
                                  <Pause size={16} /> Un-publish
                                </>
                              ) : (
                                <>
                                  <Play size={16} /> Publish
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-[#2e3a4b]" />

                            <DropdownMenuItem
                              onClick={() => handleDeleteStatusPage(page.id)}
                              className="text-red-400 flex gap-2 focus:text-red-400"
                            >
                              <Trash2 size={16} className="text-red-400" />{" "}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
