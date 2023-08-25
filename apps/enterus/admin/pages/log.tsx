import React, { useEffect, useRef } from 'react';
import DashboardLayout from '../layout/dashbaord';
import { useHttp } from '../hook/useHttp';
import { GetLogDTO } from '@enterslash/enterus/types';
import { get_all_log } from '@enterslash/enterus/http-client';
import { Button } from '@enterslash/react-ui';
import { formatDate } from '@enterslash/utils';

const LogPage = () => {
  const terminal = useRef<HTMLDivElement>(null);
  const {
    data: logs,
    request,
    loading,
  } = useHttp<GetLogDTO[]>(() => get_all_log());

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    request();
  };

  useEffect(() => {
    if (terminal.current) {
      terminal.current.scrollTop = terminal.current.scrollHeight;
    }
  }, [logs]);

  return (
    <DashboardLayout>
      <main style={{ fontFamily: 'monospace' }}>
        <div className="flex justify-between mb-7 items-center">
          <h2>Logs</h2>
          <div>
            <Button loading={loading} onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </div>
        <section
          ref={terminal}
          className="log_section rounded-md h-[calc(100vh-200px)] overflow-auto px-4 pt-4 pb-[200px] bg-gray-900"
        >
          <div>
            {!loading ? (
              logs?.reverse()?.map((log) => (
                <div className="" key={log._id}>
                  <div className="flex gap-4 items-center my-3">
                    <p className="text-white">
                      {formatDate(log.timestamp, 'dd-MM-yy hh:mm a')} &gt;{' '}
                    </p>
                    <p
                      style={{ width: 30 }}
                      className={
                        log.level === 'error'
                          ? 'text-red-400'
                          : 'text-green-400'
                      }
                    >
                      {log.level}
                    </p>
                    <p className="text-gray-400"> {log.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Loading...</p>
            )}
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
};

export default LogPage;
