import { History, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { APIFetchError, updateUserInfo } from '@/lib/api';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Status, StatusBadge } from '@/components/user/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUserStatus } from '@/lib/user';
import { sample } from '@/lib/utils';
import { useUserStore } from '@/stores/user';

import type { APIError } from '@/lib/api';

type Props = Readonly<{
  open: boolean;
  setOpen(open: boolean): void;
}>;

type AllowedStatus = Status.JoinMe | Status.Active | Status.AskMe | Status.DoNotDistrub;

const formSchema = z.object({
  status: z.enum([Status.JoinMe, Status.Active, Status.AskMe, Status.DoNotDistrub]),
  statusDescription: z.string().max(32, { message: 'Status Description must contain at most 32 characters' }),
});

const StatusLabel = {
  [Status.JoinMe]: 'Join Me',
  [Status.Active]: 'Active',
  [Status.AskMe]: 'Ask Me',
  [Status.DoNotDistrub]: 'Do Not Distrub',
} as Record<AllowedStatus, string>;

const StatusDescription = {
  [Status.JoinMe]: 'Auto-accept invite requests',
  [Status.Active]: 'See invite requests',
  [Status.AskMe]: 'Hide location, see invite requests',
  [Status.DoNotDistrub]: 'Hide location, hide invite requests',
} as Record<AllowedStatus, string>;

const motds = [
  'How\'s everything been going recently?',
  'How have things been on your side lately?',
  'Anything interesting happening with you recently?',
  'I hope all is well with you today. How have things been?',
  'How’s it going? What’s on your mind today?',
];

const EditStatusDialog: React.FC<Props> = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.current);
  const fetch = useUserStore((state) => state.fetchCurrent);

  if (!user) {
    setOpen(false);
    void navigate('/');
    return;
  }

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: (() => {
        const s = getUserStatus(user);
        if (s == Status.Offline) return Status.Active;
        return s;
      })(),
      statusDescription: user.statusDescription,
    },
  });

  const [motd] = useState(sample(motds));
  const [loading, setLoading] = useState(false);

  const updateStatus = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      await updateUserInfo(user.id, values);
      toast.success('Status has been changed successfully', {
        description: (
          <div className="flex gap-1 items-center text-muted-foreground">
            <StatusBadge status={values.status} className="size-2" />
            <span>{values.statusDescription}</span>
          </div>
        ),
      });
      void fetch();
      setOpen(false);
    }
    catch (error) {
      if (!(error instanceof APIFetchError)) return;
      const data = await error.response.json() as APIError;
      form.setError(
        data.error.message.startsWith('status ') ? 'status' : 'statusDescription',
        { message: data.error.message },
      );
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Status</DialogTitle>
          <DialogDescription>{motd}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            ref={formRef}
            className="flex flex-col gap-2"
            onSubmit={(e) => void form.handleSubmit(updateStatus)(e)}
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(v: AllowedStatus) => field.onChange(v)}
                      disabled={loading}
                      required
                    >
                      <SelectTrigger
                        className="w-auto min-w-44 self-start"
                      >
                        {field.value && (
                          <div className="flex items-center gap-2">
                            <StatusBadge status={field.value} className="size-4" />
                            <span>{StatusLabel[field.value]}</span>
                          </div>
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {
                          Object.entries(StatusLabel).map(([value, label]) => (
                            <SelectItem value={value} key={value}>
                              <div className={`
                                flex items-center gap-2 text-muted-foreground
                              `}
                              >
                                <StatusBadge
                                  status={value as Status}
                                  className="size-4"
                                />
                                <span className="text-foreground">{label}</span>
                                <span>──</span>
                                <span>{StatusDescription[value as AllowedStatus]}</span>
                              </div>
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statusDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Description</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <div className="relative">
                        <Input
                          {...field}
                          autoComplete="off"
                          maxLength={32}
                          disabled={loading}
                        />
                        <span className={`
                          absolute right-3 top-1/2 -translate-y-1/2 text-xs
                          text-muted-foreground
                        `}
                        >
                          {32 - field.value.length}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={loading}>
                          <Button variant="outline" size="icon">
                            <History />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {user.statusHistory.map((value, i) => (
                            <DropdownMenuItem key={`status-history-${i}`} onSelect={() => field.onChange(value)}>
                              {value}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={loading} variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={loading} onClick={() => formRef.current?.requestSubmit()}>
            {loading && <Loader2 className="animate-spin" />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
EditStatusDialog.displayName = 'EditStatusDialog';

export default EditStatusDialog;
