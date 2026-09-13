import { expect, test } from 'bun:test';
import { parseDoctorFlags } from '@/cli/doctor/flags';
import { captureConsole } from '../../helpers/console-capture';

test('doctor flags select JSON and offline diagnostics independently', () => {
  expect(parseDoctorFlags([])).toEqual({ json: false, skipUpdateCheck: false });
  expect(parseDoctorFlags(['--skip-update-check', '--json'])).toEqual({
    json: true,
    skipUpdateCheck: true,
  });
});

test('doctor rejects unknown options and positional arguments', async () => {
  const result = await captureConsole(() => parseDoctorFlags(['--nope', 'extra']));
  expect(result.returned).toBeNull();
  expect(result.log).toEqual([]);
  expect(result.error).toEqual([
    'Unknown option for doctor: --nope',
    'Unexpected argument for doctor: extra',
  ]);
});
