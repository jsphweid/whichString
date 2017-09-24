signal = [2., 1., 0., 1., 2., 1., 0., 1., 2., 1., 0.]
filter = [1., 0., 0., 0., 1.]

signal_length = len(signal)
filter_length = len(filter)
convolved_signal_length = signal_length + filter_length - 1
print('convolved_signal_length', convolved_signal_length)

convolved_signal = [0] * convolved_signal_length
for i in range(0, convolved_signal_length):
    for j in range(0, filter_length):
        if (i - j >= 0) and (i - j < signal_length):
            convolved_signal[i] += filter[j] * signal[i - j]

print(convolved_signal)


convolved_signal = [0] * convolved_signal_length
print('is reset..?, should be zeros...', convolved_signal)
for i in range(0, signal_length):
    for j in range(0, filter_length):
        convolved_signal[i + j] += signal[i] * filter[j]

print(convolved_signal)

