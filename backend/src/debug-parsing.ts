import fs from 'fs';
import path from 'path';
import { analyzeStrategy } from './services/analysis.service';

const backtestPath = path.join(__dirname, '../../BackTest_file_ejemplo.csv');
const realtimePath = path.join(__dirname, '../../RealTime_file_ejemplo.csv');

try {
    const backtestContent = fs.readFileSync(backtestPath, 'utf-8');
    const realtimeContent = fs.readFileSync(realtimePath, 'utf-8');

    console.log('=== ANALYZE STRATEGY ===');
    const analysis = analyzeStrategy(backtestContent, realtimeContent);

    console.log('Total points:', analysis.pnlCurve.length);

    const backtestPoints = analysis.pnlCurve.filter(p => p['Backtest'] !== undefined);
    const realtimePoints = analysis.pnlCurve.filter(p => p['Real Time'] !== undefined);

    console.log('Backtest points:', backtestPoints.length);
    console.log('RealTime points:', realtimePoints.length);

    if (backtestPoints.length > 0) {
        console.log('Last Backtest Point:', backtestPoints[backtestPoints.length - 1]);
    }

    if (realtimePoints.length > 0) {
        console.log('First RealTime Point:', realtimePoints[0]);
    }

    // Check for date overlap
    if (backtestPoints.length > 0 && realtimePoints.length > 0) {
        const lastBtDate = backtestPoints[backtestPoints.length - 1].date;
        const firstRtDate = realtimePoints[0].date;
        console.log(`Transition: ${lastBtDate} -> ${firstRtDate}`);
        if (lastBtDate >= firstRtDate) {
            console.error('ERROR: Date overlap detected!');
        } else {
            console.log('SUCCESS: No date overlap.');
        }
    }

} catch (error) {
    console.error('Error:', error);
}
