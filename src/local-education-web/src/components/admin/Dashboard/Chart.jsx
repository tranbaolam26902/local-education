/* High chart */
import HighchartsReact from 'highcharts-react-official';
import HighchartsStock from 'highcharts/highstock';

/* React hooks */
import { useEffect, useState } from 'react';

/* Redux */
import { useSelector } from 'react-redux';
import { selectSettings } from '~/redux/features/shared/settings';

export function StockChart({ chartOptions }) {
    /* Selector */
    const settings = useSelector(selectSettings);

    /* Chart settings */
    const optionsStock = {
        rangeSelector: {
            buttonTheme: {
                fill: 'none',
                style: {
                    color: '#858585',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
                width: 'fit-content',
                height: 24,
                padding: 8,
                states: {
                    hover: {},
                    select: {
                        fill: '#17a2b8',
                        style: {
                            color: 'white'
                        },
                        width: 'fit-content',
                        height: 24
                    }
                }
            },
            inputBoxBorderColor: '#858585',
            inputBoxWidth: 120,
            inputBoxHeight: 32,
            inputStyle: {
                color: '#858585',
                fontWeight: 'bold',
                fontSize: '12px',
            },
            labelStyle: {
                color: '#858585',
                fontWeight: 'bold',
                fontSize: '12px'
            },
            buttons: [
                {
                    type: 'month',
                    count: 1,
                    text: '1 tháng',
                    title: 'Xem 1 tháng'
                },
                {
                    type: 'month',
                    count: 3,
                    text: '3 tháng',
                    title: 'Xem 3 tháng'
                },
                {
                    type: 'month',
                    count: 6,
                    text: '6 tháng',
                    title: 'Xem 6 tháng'
                },
                {
                    type: 'ytd',
                    text: 'Năm hiện tại',
                    title: 'Xem năm hiện tại'
                },
                {
                    type: 'year',
                    count: 1,
                    text: '1 năm trước',
                    title: 'Xem 1 năm trước'
                },
                {
                    type: 'all',
                    text: 'Tất cả',
                    title: 'Xem tất cả'
                }
            ],
            selected: 2
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%d/%m/%Y',
                month: '%m/%Y'
            }
        },
        data: {
            dateFormat: 'dd/mm/YYYY'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            xDateFormat: '%d/%m/%Y'
        },
        yAxis: {
            allowDecimals: false
        }
    };

    HighchartsStock.setOptions({
        lang: {
            zoomIn: 'Phóng to',
            zoomOut: 'Thu nhỏ',
            resetZoom: 'Khôi phục zoom',
            resetZoomTitle: 'Khôi phục zoom',
            rangeSelectorZoom: 'Phóng to',
            rangeSelectorFrom: 'Từ',
            rangeSelectorTo: 'Đến',
            months: [
                'Tháng 1',
                'Tháng 2',
                'Tháng 3',
                'Tháng 4',
                'Tháng 5',
                'Tháng 6',
                'Tháng 7',
                'Tháng 8',
                'Tháng 9',
                'Tháng 10',
                'Tháng 11',
                'Tháng 12'
            ],
            weekdays: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
        },
        accessibility: {
            enabled: false
        },
        chart: {
            backgroundColor: 'transparent',
        },
        title: {
            style: {
                color: '#17a2b8',
            }
        },
    });

    /* States */
    const [options, setOptions] = useState({ ...optionsStock, ...chartOptions });
    const [isSettingsChanged, setIsSettingsChanged] = useState(false);

    /* Side effects */
    useEffect(() => {
        const newOptions = { ...optionsStock };
        newOptions.rangeSelector.inputStyle.color = settings.darkMode ? '#fff' : '#828585';

        setOptions({ ...newOptions, ...chartOptions });
        setIsSettingsChanged(true);
    }, [settings.darkMode, chartOptions]);

    return (
        <div className='custom-chart shadow border rounded my-2'>
            {isSettingsChanged && <HighchartsReact highcharts={HighchartsStock} constructorType='stockChart' options={options} />}
        </div>
    );
}
